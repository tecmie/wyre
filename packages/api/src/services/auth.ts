import { prisma } from '@wyrecc/db';
import { sendEmail, emailHTML, forgotPasswordEmail } from '@wyrecc/dialog';
import { TRPCError } from '@trpc/server';
import type { IResetPassword, ISignUp, IVerifyEmail } from '../interfaces';
import redis from '../redis';
import { hashString, verifyHash } from '../utils';
import { ServerError } from '../utils/server-error';

export class AuthService {
  static async adminSignUp(input: ISignUp) {
    try {
      // check if admin exists
      const adminExists = await prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (adminExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Admin already exists',
        });
      }
      // check if company exists
      const companyExists = await AuthService.checkIfCompanyExists(input.companyName);

      if (companyExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Company already exists',
        });
      }

      // check if email is an organization
      const isOrganization = AuthService.checkIfEmailIsOrganization(input.email);
      if (!isOrganization) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email is not an organization',
        });
      }

      // create company
      const company = await prisma.company.create({
        data: {
          companyName: input.companyName,
          country: input.country,
          companyEmail: input.email,
          companyPhone: input.companyPhone,
        },
      });

      if (!company) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Company creation failed',
        });
      }

      //Handle email verification
      const confirmCode = JSON.stringify(Math.floor(100000 + Math.random() * 900000)); // generates a random 6-digit code
      // create admin
      const admin = await prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.companyPhone,
          password: await hashString(input.password),
          companyId: company.id,
          type: 'ADMIN',
          jobRole: input.jobRole,
          verification: {
            create: {
              token: confirmCode,
              expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
          },
        },
      });

      if (!admin) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create admin',
        });
      }

      //Send verification code to email address
      const response = await AuthService.sendAdminMailVerification(admin.email, confirmCode);

      if (!response) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send verification code',
        });
      }

      return { admin, emailStatus: response };
    } catch (error) {
      ServerError(error);
    }
  }

  static async verifyAdminEmail(input: IVerifyEmail) {
    try {
      const { id, token } = input;

      const admin = await prisma.user.findFirst({
        where: {
          id,
          // type: "ADMIN" || "SUPER_ADMIN",
        },
        select: {
          verification: true,
          emailVerified: true,
        },
      });

      if (!admin) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Account not found',
        });
      } else if (admin.emailVerified) {
        return 'Account already verified';
      } else if (!admin.verification) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Account verification failed',
        });
      }

      const now = new Date();
      const expireTime = admin.verification.expires;
      if (now > expireTime)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Verification code is expired',
        });

      if (token === admin.verification.token) {
        const adminVerfied = await prisma.user.update({
          where: {
            id: id,
          },
          data: {
            emailVerified: true,
          },

          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            emailVerified: true,
          },
        });

        return adminVerfied;
      } else {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Confirmation code is invalid',
        });
      }
    } catch (error) {
      ServerError(error);
    }
  }

  static async sendAdminMailVerification(email: string, verifyCode: string) {
    try {
      const admin = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!admin) new TRPCError({ code: 'NOT_FOUND', message: 'Admin not found' });

      const verifyEmail = emailHTML({ confirmCode: verifyCode });

      const response = await sendEmail({
        from: 'admin@tecmie.com',
        subject: 'Verify your email',
        to: email,
        textBody: 'Email sent',
        htmlBody: verifyEmail,
      });
      return response;
    } catch (error) {
      ServerError(error);
    }
  }

  static async sendForgotPasswordEmail(email: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      //Handle password otp
      const confirmCode = JSON.stringify(Math.floor(100000 + Math.random() * 900000)); // generates a random 6-digit code

      if (user) {
        await redis.hello();
        await redis.hset(`otp_${user.id}`, 'id', user.id);
        await redis.hset(`otp_${user.id}`, 'email', user.email);
        await redis.hset(`otp_${user.id}`, 'otp', confirmCode);
        await redis.expire(`otp_${user.id}`, 3600); // OTP to expire after 1 hour
      }

      const forgotEmail = forgotPasswordEmail({ confirmCode });

      const response = await sendEmail({
        from: 'admin@tecmie.com',
        subject: 'Reset your password',
        to: email,
        textBody: 'Email sent',
        htmlBody: forgotEmail,
      });

      return response;
    } catch (error) {
      ServerError(error);
    }
  }

  static async resetPassword(input: IResetPassword) {
    try {
      const { email, otp, newPassword } = input;

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      const userHash = user && (await redis.hgetall(`otp_${user.id}`));

      if (userHash?.otp !== otp) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'OTP is invalid. Request another one',
        });
      }

      const isSame = await verifyHash(newPassword, user.password);

      if (isSame) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot use the old password as the new password',
        });
      }

      const resetPass = await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          password: await hashString(newPassword),
        },
      });

      if (!resetPass) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reset password',
        });
      }

      return user;
    } catch (error) {
      ServerError(error);
    }
  }
  static async checkIfCompanyExists(companyName?: string) {
    const result = await prisma.company.findFirst({
      where: {
        companyName: companyName as string,
      },
    });

    return !!result;
  }

  static checkIfEmailIsOrganization(email: string) {
    // get all the free email domains/clients
    const emailClients = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'mail.com',
      'msn.com',
      'live.com',
      'zoho.com',
      'yandex.com',
      'protonmail.com',
      'gmx.com',
      'mail.ru',
      'inbox.com',
      'ymail.com',
      'hushmail.com',
      'rocketmail.com',
      'lavabit.com',
    ];
    // get the domain from the email
    const domain = email.split('@')[1];
    // check if the domain is in the free email clients
    const isFreeEmail = emailClients.includes(domain as string);
    if (isFreeEmail) {
      return false;
    }
    return true;
  }

  static async checkIfSuperAdmin(userId: string) {
    try {
      const result = await prisma.user.findFirst({
        where: {
          id: userId,
          type: 'ADMIN',
        },
      });
      if (!result) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: "You don't have super admin rights",
        });
      }
      return true;
    } catch (error) {
      ServerError(error);
    }
  }

  static async checkIfAdmin(userId: string) {
    try {
      const result = await prisma.user.findFirst({
        where: {
          id: userId,
          type: 'ADMIN',
        },
      });
      if (!result) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: "You don't have  admin rights",
        });
      }
      return true;
    } catch (error) {
      ServerError(error);
    }
    const result = await prisma.user.findFirst({
      where: {
        id: userId,
        type: 'ADMIN',
      },
    });
    if (!result) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: "You don't have  admin rights",
      });
    }
    return true;
  }
}

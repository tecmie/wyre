import { IPayrollSchema } from "../interfaces/payroll";
import { TRPCError } from "@trpc/server";
import { prisma } from "@wyre-zayroll/db";
import { ServicesError } from "./ServiceErrors";

export class PayrollService {
  static async createPayroll(input: IPayrollSchema) {
    try {
      const employees = await prisma.employee.findMany({
        where: {
          id: {
            in: input.employees,
          },
        },
        select: {
          id: true,
          category: true,
        },
      });

      employees.some((employees) => {
        if (employees.category === "CONTRACTOR") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Contractors cannot be added to a payroll",
          });
        }
      });

      const payroll = await prisma.payroll.create({
        data: {
          title: input.title,
          cycle: input.cycle,
          payday: input.payday,
          auto: input.auto,
          burden: input.burden,
          currency: input.currency,
          employees: { connect: employees },
        },
      });

      if (!payroll) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payroll",
        });
      }

      return payroll;
    } catch (error) {
      ServicesError(error);
    }
  }

  static async getSinglePayroll(id: string) {
    try {
      const payroll = await prisma.payroll.findUnique({
        where: {
          id,
        },
        include: {
          employees: true,
        },
      });

      if (!payroll)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payroll not found",
        });
      return payroll;
    } catch (error) {
      ServicesError(error);
    }
  }

  static async getPayrolls() {
    try {
      const payrolls = await prisma.payroll.findMany({
        include: {
          employees: true,
        },
      });
      if (!payrolls)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payrolls not found",
        });
      return payrolls;
    } catch (error) {
      ServicesError(error);
    }
  }

  static async updatePayroll(id: string, input: IPayrollSchema) {
    try {
      const payroll = await prisma.payroll.findUnique({
        where: {
          id,
        },
        include: { employees: true },
      });

      if (!payroll) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payroll not found",
        });
      }

      const employees = await prisma.employee.findMany({
        where: {
          id: {
            in: input.employees,
          },
        },
        select: {
          id: true,
        },
      });

      const updatePayroll = await prisma.payroll.update({
        where: {
          id: payroll.id,
        },
        data: {
          title: input.title,
          cycle: input.cycle,
          payday: input.payday,
          auto: input.auto,
          burden: input.burden,
          currency: input.currency,
          employees: { connect: employees },
        },
      });
      if (!updatePayroll) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Failed to update payroll",
        });
      }
      return payroll;
    } catch (error) {
      ServicesError(error);
    }
  }

  static async deletePayroll(id: string) {
    try {
      const payroll = await prisma.payroll.delete({
        where: {
          id,
        },
      });

      if (!payroll) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payroll",
        });
      }
      return "Payroll deleted successfully";
    } catch (error) {
      ServicesError(error);
    }
  }

  static async removeEmployee(payrollId: string, employeeId: string) {
    try {
      const payroll = await prisma.payroll.update({
        where: {
          id: payrollId,
        },
        data: {
          employees: {
            disconnect: {
              id: employeeId,
            },
          },
        },
      });

      if (!payroll) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create payroll",
        });
      }
      return "Employee removed successfully";
    } catch (error) {
      ServicesError(error);
    }
  }
}

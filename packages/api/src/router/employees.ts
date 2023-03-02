import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { employeeSchema } from "../interfaces";
import { EmployeeService } from "../services";

export const employeeRouter = createTRPCRouter({
  createEmployee: protectedProcedure
    .input(employeeSchema)
    .mutation(({ input }) => {
      const employee = EmployeeService.createEmployee(input);
      return employee;
    }),

  updateEmployee: protectedProcedure
    .input(z.object({ id: z.string(), data: employeeSchema }))
    .mutation(({ input }) => {
      const updateEmployee = EmployeeService.updateEmployee(
        input.id,
        input.data
      );

      return updateEmployee;
    }),

  deleteEmployee: protectedProcedure.input(z.string()).mutation(({ input }) => {
    const deleteEmployee = EmployeeService.deleteEmployee(input);

    return deleteEmployee;
  }),

  getSingleEmployee: protectedProcedure.input(z.string()).query(({ input }) => {
    const employee = EmployeeService.getSingleEmployee(input);
    return employee;
  }),

  getEmployees: protectedProcedure.query(() => {
    const employees = EmployeeService.getEmployees();
    return employees;
  }),
});

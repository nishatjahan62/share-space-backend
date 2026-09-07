export class ApiResponse {
  static success(data: unknown = {}, message = "Operation successful") {
    return { success: true, message, data };
  }
  static error(message = "Something went wrong", errors: unknown[] = []) {
    return { success: false, message, errors };
  }
}
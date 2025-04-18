import ServiceConfig from "@/utils/constants/service.constants";
import { io } from "socket.io-client";

class SocketHandler {
  private static instance: ReturnType<typeof io>;

  constructor() {}

  static getSocketInstance() {
    if (!SocketHandler.instance) {
      SocketHandler.instance = io(ServiceConfig.BASE_URL);
    }

    return SocketHandler.instance;
  }
}

export default SocketHandler;

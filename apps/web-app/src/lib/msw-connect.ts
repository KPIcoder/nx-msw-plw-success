import type { DescService } from "@bufbuild/protobuf";
import type { MethodImpl, ServiceImpl } from "@connectrpc/connect";
import { createConnectRouter } from "@connectrpc/connect";
import type { UniversalHandler } from "@connectrpc/connect/protocol";
import {
  createFetchHandler,
  createMethodUrl,
} from "@connectrpc/connect/protocol";
import { http } from "msw";

export type MethodNameFromService<TDescService extends DescService> =
  keyof TDescService["method"];

export type MethodImplFromService<
  TDescService extends DescService,
  TMethod extends MethodNameFromService<TDescService>,
> = MethodImpl<TDescService["method"][TMethod]>;

export type HandlerOptions = { baseUrl?: string; httpVersion?: string };

const DEFAULT_BASE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://in-memory";

function createScopedRpcHandler(options: HandlerOptions = {}) {
  function rpc<
    TDescService extends DescService,
    TMethodName extends MethodNameFromService<TDescService>,
  >(
    service: TDescService,
    methodName: TMethodName,
    methodImplementation: MethodImplFromService<TDescService, TMethodName>,
  ) {
    const implementation: Partial<ServiceImpl<TDescService>> = {};
    implementation[methodName] = methodImplementation;

    const connectService = createConnectRouter().service(
      service,
      implementation,
    );

    const handler =
      connectService.handlers.find(
        (handler) =>
          handler.method.name === methodName ||
          handler.method.localName === methodName,
      ) || connectService.handlers[0];

    return createMswHandlerFromConnectHandler(handler, options);
  }

  return rpc;
}

function createScopedServiceHandler(options: HandlerOptions = {}) {
  function service<TDescService extends DescService>(
    service: TDescService,
    implementation: Partial<ServiceImpl<TDescService>>,
  ) {
    const handlers = createConnectRouter().service(
      service,
      implementation,
    ).handlers;

    return handlers.map((handler) =>
      createMswHandlerFromConnectHandler(handler, options),
    );
  }

  return service;
}

function createConnectLink() {
  return (options: HandlerOptions) => {
    return {
      service: createScopedServiceHandler(options),
      rpc: createScopedRpcHandler(options),
    };
  };
}

export const connect = {
  service: createScopedServiceHandler(),
  rpc: createScopedRpcHandler(),

  link: createConnectLink(),
};

function createMswHandlerFromConnectHandler(
  handler: UniversalHandler,
  { baseUrl = DEFAULT_BASE_URL, httpVersion }: HandlerOptions = {},
) {
  const rpcHandler = createFetchHandler(handler, {
    httpVersion,
  });

  return http.post(createMethodUrl(baseUrl, handler.method), ({ request }) =>
    rpcHandler(request.clone()),
  );
}

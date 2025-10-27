export async function enableMocking() {
  if (import.meta.env.VITE_PUBLIC_DISABLE_MSW) {
    return
  }

  const { worker } = await import('./browser');


  // Start the worker with specific configuration for tRPC
  await worker.start({
    onUnhandledRequest: 'warn',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}


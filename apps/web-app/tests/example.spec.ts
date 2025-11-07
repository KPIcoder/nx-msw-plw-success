import { test as base, expect } from '@playwright/test';
import { createNetworkFixture, NetworkFixture } from '@msw/playwright';
import { createAnotherRpcHandler, handlers, httpMocKHandlerThatWorks } from '../src/mocks/handlers';


interface Fixtures {
  network: NetworkFixture;
}

const test = base.extend<Fixtures>({
  network: createNetworkFixture({
    initialHandlers: handlers
  }),
});

test.describe('MSW Fetch Tests', () => {
  test('should use default handler', async ({ page }) => {
    
    await page.goto('/');
        
   const button = page.locator('button[type="submit"]');
   await button.click();
   await expect(page.locator('text=Hello, world!')).toBeVisible();
  });

  test('should use replaced handler', async ({ page, network }) => {

    network.use(createAnotherRpcHandler());
    
    await page.goto('/');
        
    const button = page.locator('button[type="submit"]');
    await button.click();
    
    await expect(page.locator('text=Hello, world! from replaced handler')).toBeVisible();
  });

  test('should use http handler', async ({ page, network }) => {

    network.use(httpMocKHandlerThatWorks());
    
    await page.goto('/');
        
    const button = page.locator('button[type="submit"]');
    await button.click();
    
    await expect(page.locator('text=Hello, world! from replaced handler')).toBeVisible();
  });

});

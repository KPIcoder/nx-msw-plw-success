import { test as base, expect } from '@playwright/test';
import { createNetworkFixture, NetworkFixture } from '@msw/playwright';
import { handlers, replacedHandler } from '../src/mocks/handlers';


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
        
    await expect(page.locator('text=Name: John Doe')).toBeVisible();
    await expect(page.locator('text=Age: 25')).toBeVisible();
    await expect(page.locator('text=Active: Yes')).toBeVisible();
    await expect(page.locator('text=ID: 0')).toBeVisible();
  });

  test('should use replaced handler', async ({ page, network }) => {

    network.use(replacedHandler);
    
    await page.goto('/');
        
    await expect(page.locator('text=Name: Bob Johnson')).toBeVisible();
    await expect(page.locator('text=Age: 35')).toBeVisible();
    await expect(page.locator('text=Active: No')).toBeVisible();
  });

});

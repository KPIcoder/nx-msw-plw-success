import { test as base, expect } from '@playwright/test';
import { createNetworkFixture, NetworkFixture } from '@msw/playwright';
import { handlers } from '../src/mocks/handlers';
import { http, HttpResponse } from 'msw';


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

    network.use(
      http.post('*/say', async ({ request }) => {
        console.log('[MSW] say handler called - returning Hello, world!')
        return HttpResponse.json({ sentence: 'Hello, world! from replaced handler' })
      })
    );
    
    await page.goto('/');
        
    const button = page.locator('button[type="submit"]');
    await button.click();
    
    await expect(page.locator('text=Hello, world! from replaced handler')).toBeVisible();
  });

});

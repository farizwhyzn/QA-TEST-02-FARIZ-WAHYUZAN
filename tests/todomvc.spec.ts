import { test, expect } from '@playwright/test';

const HOME_URL = 'https://todomvc.com/examples/react/#/';

const addTask = async (page, taskName) => {
  await page
    .getByPlaceholder('What needs to be done?')
    .fill(taskName);

  await page.keyboard.press('Enter');
}

test('1. Visit URL', async ({ page }) => {
  // Action
  await page.goto(HOME_URL);

  // Assertion
  await expect(page.getByText('todos')).toBeVisible();
});

test('2. Add Task', async ({ page }) => {
  // Arrange
  await page.goto(HOME_URL);

  // Action
  await addTask(page, 'Go to H Club SCBD');
  await addTask(page, 'Buy a bottle of Singleton');
  await addTask(page, 'Dance the night out!');

  // Assertion
  await expect(page.getByText('Go to H Club SCBD')).toBeVisible();
  await expect(page.getByText('Buy a bottle of Singleton')).toBeVisible();
  await expect(page.getByText('Dance the night out!')).toBeVisible();
});

test('3. Complete Task', async ({ page }) => {
  // Arrange
  await page.goto(HOME_URL);
  await addTask(page, 'Go to H Club SCBD');
  await addTask(page, 'Buy a bottle of Singleton');
  await addTask(page, 'Dance the night out!');

  // Action
  await page.locator('xpath=//label[contains(text(), "Go to H Club SCBD")]/preceding-sibling::input').click();

  // Assertion
  await expect(page.locator('xpath=//label[contains(text(), "Go to H Club SCBD")]/ancestor::li')).toHaveClass('completed');
});

test('4. Delete Task', async ({ page }) => {
  // Arrange
  await page.goto(HOME_URL);
  await addTask(page, 'Go to H Club SCBD');
  await addTask(page, 'Buy a bottle of Singleton');
  await addTask(page, 'Dance the night out!');

  // Action
  await page.locator('xpath=//label[contains(text(), "Buy a bottle of Singleton")]').hover();
  await page.locator('xpath=//label[contains(text(), "Buy a bottle of Singleton")]/following-sibling::button').click();

  // Assertion
  await expect(page.getByText('Buy a bottle of Singleton')).toBeHidden();
});

test('5. Filter Tasks (Active and Completed)', async ({ page }) => {
  // Arrange
  await page.goto(HOME_URL);
  await addTask(page, 'Go to H Club SCBD');
  await addTask(page, 'Buy a bottle of Singleton');
  await addTask(page, 'Dance the night out!');

  await page.locator('xpath=//label[contains(text(), "Go to H Club SCBD")]/preceding-sibling::input').click();

  await page.locator('xpath=//label[contains(text(), "Buy a bottle of Singleton")]').hover();
  await page.locator('xpath=//label[contains(text(), "Buy a bottle of Singleton")]/following-sibling::button').click();


  // Action and Assertion (Active)
  await page.getByRole('link', { name: 'Active' }).click();
  await expect(page.getByText('Dance the night out!')).toBeVisible();

  // Action and Assertion (Completed)
  await page.getByRole('link', { name: 'Completed' }).click();
  await expect(page.getByText('Go to H Club SCBD')).toBeVisible();

});
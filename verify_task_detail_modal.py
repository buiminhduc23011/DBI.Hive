import json
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Mock data
    user_data = {
        "id": "u1",
        "email": "test@example.com",
        "fullName": "Test User",
        "role": "User",
        "theme": "light",
        "language": "en"
    }

    project_data = [
        {
            "id": "p1",
            "name": "Test Project",
            "description": "Test Description",
            "ownerId": "u1",
            "memberRoles": {"u1": "Manager"},
            "color": "#1e40af",
            "isArchived": False
        }
    ]

    task_data = [
        {
            "id": "t1",
            "title": "Test Task",
            "description": "This is a test task description",
            "projectId": "p1",
            "status": 1, # Todo
            "priority": 2, # Medium
            "assignedToId": "u1",
            "assignedToName": "Test User",
            "createdAt": "2023-01-01T00:00:00Z"
        }
    ]

    # Pre-populate localStorage
    # We need to do this before the page loads the app logic
    # One way is to load a dummy page, set storage, then load the app

    page = context.new_page()

    # Route mocks
    page.route("**/config.json", lambda route: route.fulfill(status=200, body=json.dumps({"apiUrl": "http://localhost:3000/api"})))
    page.route("**/api/auth/me", lambda route: route.fulfill(status=200, body=json.dumps(user_data)))
    page.route("**/api/projects", lambda route: route.fulfill(status=200, body=json.dumps(project_data)))
    page.route("**/api/projects?**", lambda route: route.fulfill(status=200, body=json.dumps(project_data)))
    page.route("**/api/tasks**", lambda route: route.fulfill(status=200, body=json.dumps(task_data)))
    page.route("**/api/notifications", lambda route: route.fulfill(status=200, body=json.dumps([])))
    # Mock dashboard just in case
    page.route("**/api/dashboard", lambda route: route.fulfill(status=200, body=json.dumps({
        "totalProjects": 1, "activeProjects": 1, "totalTasks": 1, "completedTasks": 0,
        "overdueTasks": 0, "dueTodayTasks": 0, "dueThisWeekTasks": 0, "myTasks": 1,
        "recentTasks": [], "overdueTasksList": [], "projectProgress": [],
        "todayTasks": [], "thisWeekTasks": [], "laterTasks": [], "noDeadlineTasks": [], "ganttTasks": []
    })))

    # Navigate to a blank page to set local storage
    page.goto("http://localhost:3000/login")

    page.evaluate("""() => {
        localStorage.setItem('accessToken', 'fake-token');
        localStorage.setItem('refreshToken', 'fake-refresh-token');
        localStorage.setItem('dbi_hive_onboarding_completed', 'true');
    }""")

    print("Navigating to Kanban board...")
    page.goto("http://localhost:3000/kanban")

    # Wait for the task to appear
    try:
        page.wait_for_selector("text=Test Task", timeout=10000)
        print("Found 'Test Task'")
    except Exception as e:
        page.screenshot(path="/home/jules/verification/kanban_error.png")
        print(f"Failed to find task: {e}")
        browser.close()
        return

    # Click the task to open modal
    page.click("text=Test Task")

    # Wait for modal
    try:
        modal = page.wait_for_selector('div[role="dialog"]', timeout=5000)
        print("Modal opened")

        # Verify accessibility attributes
        aria_modal = modal.get_attribute("aria-modal")
        if aria_modal == "true":
            print("Verified: aria-modal='true'")
        else:
            print(f"Failed: aria-modal is {aria_modal}")

        aria_labelledby = modal.get_attribute("aria-labelledby")
        if aria_labelledby:
            print(f"Verified: aria-labelledby='{aria_labelledby}'")
        else:
            print("Failed: aria-labelledby is missing")

        # Verify close button aria-label
        # The close button is usually the first button or has an X icon
        # Based on my code change: <button onClick={onClose} aria-label={t('common.close')} ...>
        # I need to know what 'common.close' translates to. Default is 'Close' or 'Đóng'.
        # Since user language mock is 'en', it should be 'Close'.

        close_btn = page.locator('button[aria-label="Close"]')
        if close_btn.count() > 0:
            print("Verified: Close button has aria-label='Close'")
        else:
            # Fallback check for any button with aria-label
            btns = page.locator('div[role="dialog"] button[aria-label]')
            count = btns.count()
            print(f"Found {count} buttons with aria-label in modal")
            for i in range(count):
                print(f" - {btns.nth(i).get_attribute('aria-label')}")

        # Test Escape key
        print("Testing Escape key...")
        page.keyboard.press("Escape")

        # Verify modal is gone
        page.wait_for_selector('div[role="dialog"]', state="detached", timeout=2000)
        print("Verified: Modal closed on Escape")

        page.screenshot(path="/home/jules/verification/success.png")

    except Exception as e:
        page.screenshot(path="/home/jules/verification/modal_error.png")
        print(f"Verification failed: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

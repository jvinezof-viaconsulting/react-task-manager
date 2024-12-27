import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskManager from "./TaskManager";

import "../../__tests__/mocks/windowMock";

describe("TaskManager", () => {
  test("renders initial state correctly", () => {
    render(<TaskManager />);

    // Check if main elements are present
    expect(screen.getByText("Task Manager")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a new task")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
  });
});

describe("TaskManager - User Interactions", () => {
  test("adds a new task when form is submitted", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    // Find form elements
    const input = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Simulate user typing and submitting
    await user.type(input, "New test task");
    await user.click(addButton);

    // Verify task was added
    expect(screen.getByText("New test task")).toBeInTheDocument();
    expect(input).toHaveValue(""); // Input should be cleared
  });

  test("can mark task as completed", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    // Add a task first
    await user.type(screen.getByPlaceholderText("Add a new task"), "Test task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    // Find and click the checkbox
    const checkbox = screen.getByLabelText('Mark "Test task" as complete');
    await user.click(checkbox);

    // Verify task is marked as completed
    expect(checkbox).toBeChecked();
    expect(screen.getByText("Test task")).toHaveClass("line-through");
  });
});

describe("TaskManager - Error States", () => {
  test("shows error when adding empty task", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    // Try to add empty task
    await user.click(screen.getByRole("button", { name: /add task/i }));

    // Verify no task was added
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});

describe("TaskManager - Async Operations", () => {
  test("loads saved tasks on mount", async () => {
    // Mock localStorage
    const mockTasks = [{ id: 1, text: "Saved task", completed: false }];

    const localStorageOriginalMock = window.localStorage;

    Object.defineProperty(window, "localStorage", {
      value: {
        ...window.localStorage,
        getItem: jest.fn().mockReturnValue(JSON.stringify(mockTasks)),
      },
    });

    render(<TaskManager />);

    // Wait for tasks to load
    expect(await screen.findByText("Saved task")).toBeInTheDocument();

    // Clean up
    Object.defineProperty(window, "localStorage", {
      value: localStorageOriginalMock,
    });
  });

  test("loads invalid json on mount", async () => {
    // the test will trigger an error because it will fall into the catch,
    // inside the catch there is a console.error that will appear in the console during the tests causing a false sense of error.
    // Let's mock console.error to prevent this behavior
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const localStorageOriginalMock = window.localStorage;

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        ...window.localStorage,
        getItem: jest.fn().mockReturnValue("invalid json"),
      },
    });

    render(<TaskManager />);

    // Wait for tasks to load
    expect(
      await screen.findByText("No tasks yet. Add one above!")
    ).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading tasks:",
      expect.any(Error)
    );

    // Clean up
    consoleSpy.mockRestore();

    Object.defineProperty(window, "localStorage", {
      value: localStorageOriginalMock,
    });
  });
});

describe("TaskManager - Edge Cases", () => {
  test("handles special characters in task text", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const specialText = "!@#$%^&*()";
    await user.type(screen.getByPlaceholderText("Add a new task"), specialText);
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  test("handles long task text", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const longText = "a".repeat(100);
    await user.type(screen.getByPlaceholderText("Add a new task"), longText);
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText(longText)).toBeInTheDocument();
  });
});

describe("TaskManager - Integration", () => {
  test("complete flow: add, complete, and delete task", async () => {
    const user = userEvent.setup();
    render(<TaskManager />);

    const addButton = screen.getByRole("button", { name: /add task/i });

    // Add task
    await user.type(
      screen.getByPlaceholderText("Add a new task"),
      "Integration test task"
    );
    await user.click(addButton);

    // Verify task added
    const taskElement = screen.getByText("Integration test task");
    expect(taskElement).toBeInTheDocument();

    // Add another task
    await user.type(
      screen.getByPlaceholderText("Add a new task"),
      "second integration test task"
    );
    await user.click(addButton);

    // Complete task
    await user.click(
      screen.getByLabelText('Mark "Integration test task" as complete')
    );
    expect(taskElement).toHaveClass("line-through");

    // Uncheck task
    await user.click(
      screen.getByLabelText('Mark "Integration test task" as incomplete')
    );
    expect(taskElement).not.toHaveClass("line-through");

    // Delete task
    await user.click(
      screen.getByLabelText('Delete task "Integration test task"')
    );
    expect(taskElement).not.toBeInTheDocument();
  });
});

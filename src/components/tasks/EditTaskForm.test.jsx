import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import EditTaskForm from './EditTaskForm.jsx';

const task = {
  id: 7,
  title: 'Read documentation',
  is_complete: false,
  user_id: 'user-a',
  created_at: '2026-09-17T12:00:00Z',
};

describe('EditTaskForm', () => {
  it('prefills the task, disables unchanged saves, and supports cancel', async () => {
    const user = userEvent.setup();

    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <EditTaskForm
        task={task}
        onSave={onSave}
        onCancel={onCancel}
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: /task title/i,
      }),
    ).toHaveValue('Read documentation');

    expect(
      screen.getByRole('checkbox', {
        name: /mark this task as completed/i,
      }),
    ).not.toBeChecked();

    expect(
      screen.getByRole('button', {
        name: /save changes/i,
      }),
    ).toBeDisabled();

    await user.click(
      screen.getByRole('button', {
        name: /cancel/i,
      }),
    );

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSave).not.toHaveBeenCalled();
  });

  it('submits only the trimmed title and completion status', async () => {
    const user = userEvent.setup();

    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <EditTaskForm
        task={task}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    const titleInput = screen.getByRole('textbox', {
      name: /task title/i,
    });

    await user.clear(titleInput);

    await user.type(
      titleInput,
      '   Complete the assignment   ',
    );

    await user.click(
      screen.getByRole('checkbox', {
        name: /mark this task as completed/i,
      }),
    );

    await user.click(
      screen.getByRole('button', {
        name: /save changes/i,
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);

      expect(onSave).toHaveBeenCalledWith({
        title: 'Complete the assignment',
        is_complete: true,
      });
    });
  });

  it('rejects a whitespace-only title without calling onSave', async () => {
    const user = userEvent.setup();

    const onSave = vi.fn();

    render(
      <EditTaskForm
        task={task}
        onSave={onSave}
        onCancel={vi.fn()}
      />,
    );

    const titleInput = screen.getByRole('textbox', {
      name: /task title/i,
    });

    await user.clear(titleInput);
    await user.type(titleInput, '   ');

    await user.click(
      screen.getByRole('button', {
        name: /save changes/i,
      }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Task title cannot be empty.');

    expect(titleInput).toHaveAttribute(
      'aria-invalid',
      'true',
    );

    expect(onSave).not.toHaveBeenCalled();
  });
});
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

import NewTaskForm from './NewTaskForm.jsx';

describe('NewTaskForm', () => {
  it('submits a trimmed title and clears the input after success', async () => {
    const user = userEvent.setup();

    const onAddTask = vi.fn().mockResolvedValue(undefined);

    render(
      <NewTaskForm onAddTask={onAddTask} />,
    );

    const titleInput = screen.getByRole('textbox', {
      name: /task title/i,
    });

    await user.type(
      titleInput,
      '   Read React documentation   ',
    );

    await user.click(
      screen.getByRole('button', {
        name: /add task/i,
      }),
    );

    await waitFor(() => {
      expect(onAddTask).toHaveBeenCalledTimes(1);

      expect(onAddTask).toHaveBeenCalledWith(
        'Read React documentation',
      );

      expect(titleInput).toHaveValue('');
    });
  });

  it('shows an error and preserves the title when adding fails', async () => {
    const user = userEvent.setup();

    const onAddTask = vi.fn().mockRejectedValue(
      new Error('Database unavailable'),
    );

    render(
      <NewTaskForm onAddTask={onAddTask} />,
    );

    const titleInput = screen.getByRole('textbox', {
      name: /task title/i,
    });

    await user.type(titleInput, 'Finish homework');

    await user.click(
      screen.getByRole('button', {
        name: /add task/i,
      }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Could not add the task: Database unavailable',
    );

    expect(titleInput).toHaveValue('Finish homework');

    expect(
      screen.getByRole('button', {
        name: /add task/i,
      }),
    ).toBeEnabled();
  });
});

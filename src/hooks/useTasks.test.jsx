import {
  act,
  renderHook,
  waitFor,
} from '@testing-library/react';

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
}));

vi.mock('../lib/supabaseClient.js', () => ({
  supabase: {
    from: fromMock,
  },
}));

import { useTasks } from './useTasks.js';

const existingTask = {
  id: 7,
  title: 'Read documentation',
  is_complete: false,
  user_id: 'user-a',
  created_at: '2026-09-17T12:00:00Z',
};

function createLoadQuery(response) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(response),
  };
}

function createInsertQuery(response) {
  return {
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(response),
  };
}

describe('useTasks', () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it('loads tasks using the current user filter', async () => {
    const loadQuery = createLoadQuery({
      data: [existingTask],
      error: null,
    });

    fromMock.mockReturnValue(loadQuery);

    const { result } = renderHook(() =>
      useTasks('user-a'),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

      expect(result.current.tasks).toEqual([
        existingTask,
      ]);
    });

    expect(fromMock).toHaveBeenCalledWith('tasks');

    expect(loadQuery.select).toHaveBeenCalledWith('*');

    expect(loadQuery.eq).toHaveBeenCalledWith(
      'user_id',
      'user-a',
    );

    expect(loadQuery.order).toHaveBeenCalledWith(
      'created_at',
      {
        ascending: false,
      },
    );

    expect(result.current.error).toBeNull();
  });

  it('inserts an owned task and adds it to local state', async () => {
    const newTask = {
      id: 8,
      title: 'Write tests',
      is_complete: false,
      user_id: 'user-a',
      created_at: '2026-09-17T13:00:00Z',
    };

    const loadQuery = createLoadQuery({
      data: [existingTask],
      error: null,
    });

    const insertQuery = createInsertQuery({
      data: newTask,
      error: null,
    });

    fromMock
      .mockReturnValueOnce(loadQuery)
      .mockReturnValueOnce(insertQuery);

    const { result } = renderHook(() =>
      useTasks('user-a'),
    );

    await waitFor(() => {
      expect(result.current.tasks).toEqual([
        existingTask,
      ]);
    });

    await act(async () => {
      await result.current.addTask('Write tests');
    });

    expect(insertQuery.insert).toHaveBeenCalledWith([
      {
        title: 'Write tests',
        is_complete: false,
        user_id: 'user-a',
      },
    ]);

    expect(insertQuery.select).toHaveBeenCalled();

    expect(insertQuery.single).toHaveBeenCalled();

    expect(result.current.tasks).toEqual([
      newTask,
      existingTask,
    ]);
  });

  it('exposes a loading error without adding tasks', async () => {
    const loadQuery = createLoadQuery({
      data: null,

      error: {
        message: 'Read denied',
      },
    });

    fromMock.mockReturnValue(loadQuery);

    const { result } = renderHook(() =>
      useTasks('user-a'),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);

      expect(result.current.error).toBe(
        'Could not load tasks: Read denied',
      );
    });

    expect(result.current.tasks).toEqual([]);
  });

  // We'd need to write a test for toggle a task to mark it complete and incomplete
  // And also a test to delete the task
});
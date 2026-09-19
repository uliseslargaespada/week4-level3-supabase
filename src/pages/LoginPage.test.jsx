import {
  render,
  screen,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import LoginPage from './LoginPage.jsx';

function renderLoginPage(onSignIn) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/login',

          state: {
            from: {
              pathname: '/tasks/7/edit',
            },
          },
        },
      ]}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage onSignIn={onSignIn} />
          }
        />

        <Route
          path="/tasks/:taskId/edit"
          element={
            <h1>Requested edit page</h1>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('signs in and returns to the originally requested page', async () => {
    const user = userEvent.setup();

    const onSignIn = vi.fn().mockResolvedValue({});

    renderLoginPage(onSignIn);

    await user.type(
      screen.getByLabelText(/^email$/i),
      'student@example.com',
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      'classroom123',
    );

    await user.click(
      screen.getByRole('button', {
        name: /^log in$/i,
      }),
    );

    expect(
      await screen.findByRole('heading', {
        name: 'Requested edit page',
      }),
    ).toBeInTheDocument();

    expect(onSignIn).toHaveBeenCalledWith(
      'student@example.com',
      'classroom123',
    );
  });

  it('shows a login error and stays on the login page', async () => {
    const user = userEvent.setup();

    const onSignIn = vi.fn().mockRejectedValue(
      new Error('Incorrect email or password'),
    );

    renderLoginPage(onSignIn);

    await user.type(
      screen.getByLabelText(/^email$/i),
      'student@example.com',
    );

    await user.type(
      screen.getByLabelText(/^password$/i),
      'classroom123',
    );

    await user.click(
      screen.getByRole('button', {
        name: /^log in$/i,
      }),
    );

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Incorrect email or password');

    expect(
      screen.getByRole('heading', {
        name: /^log in$/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /^log in$/i,
      }),
    ).toBeEnabled();
  });
});
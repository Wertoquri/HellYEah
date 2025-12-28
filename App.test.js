import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders initial greeting', () => {
  render(<App />);
  expect(screen.getByText(/з новим роком/i)).toBeInTheDocument();
});

test('changes greeting on button click', async () => {
  render(<App />);

  const randomSpy = jest
    .spyOn(Math, 'random')
    // TITLES length (currently 18): 0.12 -> index 2
    // EMOJIS length (currently 20): 0.16 -> index 3
    // GRADIENTS length (currently 16): 0.13 -> index 2
    .mockReturnValueOnce(0.12)
    .mockReturnValueOnce(0.16)
    .mockReturnValueOnce(0.13);

  await userEvent.click(screen.getByRole('button', { name: /оновити/i }));

  expect(await screen.findByText(/щасливого різдва/i)).toBeInTheDocument();
  expect(screen.getByText('🌟🎉💫')).toBeInTheDocument();

  const main = screen.getByRole('main');
  expect(main.getAttribute('data-gradient')).toMatch(/linear-gradient/i);
  expect(main.getAttribute('data-gradient')).toMatch(/#11998e/i);

  randomSpy.mockRestore();
});

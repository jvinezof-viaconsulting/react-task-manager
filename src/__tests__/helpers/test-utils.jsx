import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const customRender = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => {
    return (
      // Add your providers here (React Query, Redux, etc)
      children
    );
  };

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

export { customRender as render };

'use client';

import { Provider } from 'react-redux';
import store from './_states';

export function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

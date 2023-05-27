import '@/styles/reset.css'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

//redux
import wrapper from "@/store/index";
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
  const {store, props} = wrapper.useWrappedStore(pageProps);
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

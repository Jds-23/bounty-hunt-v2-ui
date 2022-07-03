import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AppProvider } from "../context/StateProvider";
import Header from "../components/Header";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}

export default MyApp;

function BaseLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  console.log(router.pathname.split("/"));
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/x-icon" href="/logo.ico"></link>
      </Head>
      <AppProvider>
        <Header />
        <Head>
          <title>
            BountyHunt-{router.pathname.split("/")[1]?.toUpperCase()}
          </title>
        </Head>

        {children}
      </AppProvider>
    </>
  );
}

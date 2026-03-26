import AppRouter from "./routes/AppRouter";
import { HelmetProvider } from "react-helmet-async";

export default function App() {
  return (
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
  );
}

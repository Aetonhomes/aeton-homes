import { Route, Switch, useLocation } from "wouter";
import Index from "./pages/index";
import Videos from "./pages/videos";
import Admin from "./pages/admin/index";
import { Provider } from "./components/provider";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/videos" component={Videos} />
        <Route path="/admin" component={Admin} />
      </Switch>
      {/* WhatsApp button on all non-admin pages */}
      {!isAdmin && <WhatsAppButton />}
    </Provider>
  );
}

export default App;

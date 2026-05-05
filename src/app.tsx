import { Route, Switch } from "wouter";
import Index from "./pages/index";
import Videos from "./pages/videos";
import Admin from "./pages/admin/index";
import { Provider } from "./components/provider";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/videos" component={Videos} />
        <Route path="/admin" component={Admin} />
      </Switch>
    </Provider>
  );
}

export default App;

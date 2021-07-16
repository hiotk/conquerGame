import Route from './core/route';

import HomeScene from './scenes/home/index.jsx'
import LoadingScene from './scenes/loading/index'
import PlayScene from './scenes/play/index.jsx'
import BabylonDemoScene from './scenes/babylon/index.jsx'

Route.RouteHistory.init();
Route.RouteHistory.addRoute('/home', new HomeScene());
Route.RouteHistory.addRoute('/loading', new LoadingScene());
Route.RouteHistory.addRoute('/play', new PlayScene());
Route.RouteHistory.addRoute('/babylon', new BabylonDemoScene);

Route.RouteHistory.push('/loading', { first: true });

export default Route.RouteHistory;
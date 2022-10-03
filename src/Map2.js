import React from "react";
import 'dotenv/config';
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider} from "react-redux";
import KeplerGl from "kepler.gl";
// import { addDataToMap } from "kepler.gl/actions";
// import useSwr from "swr";
require('dotenv').config()

const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

export default function Map2()  {
  return (
    <Provider store={store}>
    <MapViewer />
  </Provider>
  )
}


function MapViewer() {

return (
    <KeplerGl
      id="covid"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}
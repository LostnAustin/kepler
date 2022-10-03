import React from "react";
import 'dotenv/config';
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider, useDispatch } from "react-redux";
import KeplerGl from "kepler.gl";
import { addDataToMap } from "kepler.gl/actions";
import useSwr from "swr";
require('dotenv').config()

const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

export default function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
}

// const mapStyles = [
//   {
//     id: 'my_dark_map',
//     label: 'Dark Streets 9',
//     url: 'mapbox://styles/mapbox/dark-v9',
//     icon: `${apiHost}/styles/v1/mapbox/dark-v9/static/-122.3391,37.7922,9.19,0,0/400x300?access_token=${accessToken}&logo=false&attribution=false`,
//     layerGroups: [
//       {
//         slug: 'label',
//         filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
//         defaultVisibility: true
//       },
//       {
//         // adding this will keep the 3d building option
//         slug: '3d building',
//         filter: () => false,
//         defaultVisibility: false
//       }
//     ]
//   }
// ];


function Map() {
  const dispatch = useDispatch();
  const { data } = useSwr("covid", async () => {
    const response = await fetch(

      "https://gist.githubusercontent.com/leighhalliday/a994915d8050e90d413515e97babd3b3/raw/a3eaaadcc784168e3845a98931780bd60afb362f/covid19.json"
    );
    const data = await response.json();
    return data;
  });

  React.useEffect(() => {
    if (data) {
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: "COVID-19",
              id: "covid19"
            },
            data
          },
          option: {
            centerMap: true,
            readOnly: false
          },
          config: {}
        })
      );
    }
  }, [dispatch, data]);

  return (
    <KeplerGl
      id="covid"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}

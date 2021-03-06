import * as React from "react";
import "react-native";
import { StatusBar } from "react-native";
// @ts-ignore
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import * as renderer from "react-test-renderer";
// import { Provider } from "react-redux";
// import { AppLoaderRoot } from "../app-loading";
// import { store } from "../common/store";

describe("App snapshot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    NavigationTestUtils.resetInternalState();
  });

  it("renders the StatusBar", async () => {
    const tree = renderer.create(<StatusBar />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it("renders AppLoaderRoot", async () => {
  //   const tree = renderer
  //     .create(
  //       /* tslint:disable:no-any */
  //       <Provider store={store as any}>
  //         <AppLoaderRoot onFinish={() => null} />
  //       </Provider>
  //     )
  //     .toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});

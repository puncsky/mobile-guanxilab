/* tslint:disable:no-any */
import { List } from "@ant-design/react-native";
import Constants from "expo-constants";
import * as StoreReview from "expo-store-review";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Platform, ScrollView, Switch, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import { analytics } from "../../common/analytics";
import { ListHeader } from "../../common/list-header";
import { registerForPushNotificationAsync } from "../../common/register-push-token";
import { actionUpdateReduxState } from "../../common/root-reducer";
import { AppState } from "../../common/store";
import { setTheme, theme } from "../../common/theme";
import i18n from "../../translations";
import { ScreenProps } from "../../types/screen-props";
import { AccountHeader } from "./account-header";
import { actionLogout } from "./account-reducer";

const Item = List.Item;
const Brief = Item.Brief;

type AboutProps = {
  navigation: NavigationScreenProp<string>;
  authToken: string;
  locale: string;
  actionLogout: Function;
  actionUpdateReduxState: Function;
  screenProps: ScreenProps;
  currentTheme: "dark" | "light";
};

export const About = connect(
  (state: AppState) => ({
    authToken: state.base.authToken,
    locale: state.base.locale,
    currentTheme: state.base.currentTheme
  }),
  dispatch => ({
    actionLogout(authToken: string): void {
      dispatch(actionLogout(authToken));
    },
    actionUpdateReduxState(payload: Object): void {
      dispatch(actionUpdateReduxState(payload));
    }
  })
)(
  class AboutInner extends React.Component<AboutProps> {
    async componentDidMount(): Promise<void> {
      await registerForPushNotificationAsync();
      await analytics.track("page_view_mine", {});
    }

    renderAppSection = () => {
      const {
        actionLogout,
        authToken,
        actionUpdateReduxState,
        locale,
        currentTheme
      } = this.props;
      const backgroundColor = {
        backgroundColor: theme.white,
        color: theme.text01
      };
      return (
        <List
          style={backgroundColor}
          renderHeader={<ListHeader>{i18n.t("about")}</ListHeader>}
        >
          <Item
            disabled
            extra={Platform.OS === "ios" ? "Apple Store" : "Google Play"}
            arrow="horizontal"
            style={backgroundColor}
            onPress={async () => {
              const storeUrl = StoreReview.storeUrl();
              if (storeUrl) {
                await WebBrowser.openBrowserAsync(storeUrl);
              }
            }}
          >
            {i18n.t("reviewApp")}
          </Item>
          <Item
            disabled
            style={backgroundColor}
            extra={
              <Switch
                value={String(locale).startsWith("en")}
                onValueChange={value => {
                  const changeTo = value ? "en" : "zh";
                  actionUpdateReduxState({
                    base: { locale: changeTo }
                  });
                  i18n.locale = changeTo;
                  this.props.screenProps.setLocale(changeTo);
                }}
              />
            }
          >
            {i18n.t("currentLanguage")}
            <Brief>
              {String(locale).startsWith("en")
                ? i18n.t("english")
                : i18n.t("chinese")}
            </Brief>
          </Item>

          <Item
            style={backgroundColor}
            disabled
            extra={
              <Switch
                value={currentTheme === "dark"}
                onValueChange={value => {
                  const mode = value ? "dark" : "light";
                  setTheme(mode);
                  actionUpdateReduxState({
                    base: { currentTheme: mode }
                  });
                }}
              />
            }
          >
            {i18n.t("theme")}
            <Brief>{currentTheme === "dark" ? "Dark" : "Light"}</Brief>
          </Item>

          <Item
            arrow="horizontal"
            style={backgroundColor}
            onPress={() => {
              this.props.navigation.navigate("Debug");
            }}
          >
            {i18n.t("debug")}
          </Item>

          <Item
            style={backgroundColor}
            disabled
            extra={Constants.nativeAppVersion}
          >
            {i18n.t("currentVersion")}
          </Item>
          {authToken ? (
            <Item
              style={backgroundColor}
              disabled
              onPress={() => {
                Alert.alert(
                  "",
                  i18n.t("logoutAlertMsg"),
                  [
                    { text: i18n.t("logoutAlertCancel"), style: "cancel" },
                    {
                      text: i18n.t("logoutAlertConfirm"),
                      onPress: () => {
                        actionLogout(authToken);
                      }
                    }
                  ],
                  { cancelable: false }
                );
              }}
            >
              {i18n.t("logout")}
            </Item>
          ) : (
            <View />
          )}
        </List>
      );
    };

    render(): JSX.Element {
      return (
        <ScrollView style={{ backgroundColor: theme.white }}>
          <AccountHeader />
          {this.renderAppSection()}
        </ScrollView>
      );
    }
  }
);

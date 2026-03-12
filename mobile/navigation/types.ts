import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ─── Auth ────────────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// ─── Customer tab navigator ──────────────────────────────────────────────────

export type CustomerTabParamList = {
  BrowseTab: undefined;
  OrdersTab: undefined;
  ProfileTab: undefined;
};

export type CustomerTabScreenProps<T extends keyof CustomerTabParamList> =
  BottomTabScreenProps<CustomerTabParamList, T>;

// ─── Customer stacks (one per tab) ───────────────────────────────────────────

export type CustomerBrowseStackParamList = {
  Browse: undefined;
  PublicChefProfile: { slug: string };
  OrderBuilder: { slug: string };
};

export type CustomerOrdersStackParamList = {
  Orders: undefined;
  OrderDetail: { id: string };
};

export type CustomerProfileStackParamList = {
  CustomerProfile: undefined;
  ProfileEdit: undefined;
};

// Legacy flat list kept for any existing screen prop references
export type CustomerStackParamList = CustomerBrowseStackParamList &
  CustomerOrdersStackParamList &
  CustomerProfileStackParamList;

export type CustomerScreenProps<T extends keyof CustomerStackParamList> =
  NativeStackScreenProps<CustomerStackParamList, T>;

// ─── Chef tab navigator ───────────────────────────────────────────────────────

export type ChefTabParamList = {
  MenusTab: undefined;
  TicketsTab: undefined;
  ChefProfileTab: undefined;
};

export type ChefTabScreenProps<T extends keyof ChefTabParamList> =
  BottomTabScreenProps<ChefTabParamList, T>;

// ─── Chef stacks (one per tab) ────────────────────────────────────────────────

export type ChefMenusStackParamList = {
  Menus: undefined;
  AllMenus: undefined;
  MenuBuilder: { menuId: string };
};

export type ChefTicketsStackParamList = {
  Tickets: undefined;
};

export type ChefProfileStackParamList = {
  ChefProfile: undefined;
  ChefProfileEdit: undefined;
};

// Legacy flat list kept for any existing screen prop references
export type ChefStackParamList = ChefMenusStackParamList &
  ChefTicketsStackParamList &
  ChefProfileStackParamList;

export type ChefScreenProps<T extends keyof ChefStackParamList> =
  NativeStackScreenProps<ChefStackParamList, T>;

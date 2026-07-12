import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserRole } from "../types";
import ManagerDashboardScreen from "../screens/ManagerDashboardScreen";
import ManagerScheduleScreen from "../screens/ManagerScheduleScreen";
import EmployeeManagementScreen from "../screens/EmployeeManagementScreen";
import CompanySettingsScreen from "../screens/CompanySettingsScreen";
import AuditHistoryScreen from "../screens/AuditHistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import MyScheduleScreen from "../screens/MyScheduleScreen";
import OpenShiftsScreen from "../screens/OpenShiftsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import CompanyInfoScreen from "../screens/CompanyInfoScreen";
import AvailabilityScreen from "../screens/AvailabilityScreen";
import RequestsScreen from "../screens/RequestsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs({ role }: { role: UserRole }) {
  if (role === "manager") {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={ManagerDashboardScreen} />
        <Tab.Screen name="Schedule" component={ManagerScheduleScreen} />
        <Tab.Screen name="Employees" component={EmployeeManagementScreen} />
        <Tab.Screen name="CompanySettings" component={CompanySettingsScreen} />
        <Tab.Screen name="Audit" component={AuditHistoryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MySchedule" component={MyScheduleScreen} />
      <Tab.Screen name="OpenShifts" component={OpenShiftsScreen} />
      <Tab.Screen name="Availability" component={AvailabilityScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Company" component={CompanyInfoScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


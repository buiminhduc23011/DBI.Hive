import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'vi';

interface Translations {
    [key: string]: {
        en: string;
        vi: string;
    };
}

const translations: Translations = {
    // Common
    'common.save': { en: 'Save', vi: 'Lưu' },
    'common.cancel': { en: 'Cancel', vi: 'Hủy' },
    'common.close': { en: 'Close', vi: 'Đóng' },
    'common.delete': { en: 'Delete', vi: 'Xóa' },
    'common.edit': { en: 'Edit', vi: 'Sửa' },
    'common.create': { en: 'Create', vi: 'Tạo' },
    'common.search': { en: 'Search', vi: 'Tìm kiếm' },
    'common.loading': { en: 'Loading...', vi: 'Đang tải...' },
    'common.noData': { en: 'No data', vi: 'Không có dữ liệu' },
    'common.confirm': { en: 'Confirm', vi: 'Xác nhận' },
    'common.back': { en: 'Back', vi: 'Quay lại' },
    'common.next': { en: 'Next', vi: 'Tiếp theo' },
    'common.finish': { en: 'Finish', vi: 'Hoàn thành' },
    'common.skip': { en: 'Skip', vi: 'Bỏ qua' },
    'common.allProjects': { en: 'All Projects', vi: 'Tất cả dự án' },

    // Auth
    'auth.login': { en: 'Sign In', vi: 'Đăng nhập' },
    'auth.register': { en: 'Sign Up', vi: 'Đăng ký' },
    'auth.logout': { en: 'Logout', vi: 'Đăng xuất' },
    'auth.email': { en: 'Email', vi: 'Email' },
    'auth.username': { en: 'Username', vi: 'Tên đăng nhập' },
    'auth.emailOrUsername': { en: 'Email or Username', vi: 'Email hoặc Tên đăng nhập' },
    'auth.password': { en: 'Password', vi: 'Mật khẩu' },
    'auth.confirmPassword': { en: 'Confirm Password', vi: 'Xác nhận mật khẩu' },
    'auth.fullName': { en: 'Full Name', vi: 'Họ và tên' },
    'auth.signingIn': { en: 'Signing in...', vi: 'Đang đăng nhập...' },
    'auth.signingUp': { en: 'Signing up...', vi: 'Đang đăng ký...' },
    'auth.noAccount': { en: "Don't have an account?", vi: 'Chưa có tài khoản?' },
    'auth.hasAccount': { en: 'Already have an account?', vi: 'Đã có tài khoản?' },
    'auth.loginFailed': { en: 'Login failed', vi: 'Đăng nhập thất bại' },
    'auth.registerFailed': { en: 'Registration failed', vi: 'Đăng ký thất bại' },

    // Navigation
    'nav.dashboard': { en: 'Dashboard', vi: 'Tổng quan' },
    'nav.projects': { en: 'Projects', vi: 'Dự án' },
    'nav.kanban': { en: 'Kanban Board', vi: 'Bảng Kanban' },
    'nav.backlog': { en: 'Backlog', vi: 'Backlog' },
    'nav.calendar': { en: 'Calendar', vi: 'Lịch' },
    'nav.settings': { en: 'Settings', vi: 'Cài đặt' },

    // Dashboard
    'dashboard.title': { en: 'Dashboard', vi: 'Tổng quan' },
    'dashboard.welcome': { en: 'Welcome back', vi: 'Chào mừng trở lại' },
    'dashboard.totalTasks': { en: 'Total Tasks', vi: 'Tổng số công việc' },
    'dashboard.completedTasks': { en: 'Completed', vi: 'Hoàn thành' },
    'dashboard.inProgress': { en: 'In Progress', vi: 'Đang thực hiện' },
    'dashboard.overdue': { en: 'Overdue', vi: 'Quá hạn' },
    'dashboard.assignedTasks': { en: 'Assigned Tasks', vi: 'Công việc đã giao' },
    'dashboard.unassignedTasks': { en: 'Unassigned Tasks', vi: 'Công việc chưa giao' },
    'dashboard.needsAssignment': { en: 'Needs assignment', vi: 'Cần giao việc' },
    'dashboard.allAssigned': { en: 'All tasks assigned', vi: 'Đã giao hết công việc' },
    // Smart Task Display
    'dashboard.today': { en: 'Today', vi: 'Hôm nay' },
    'dashboard.thisWeek': { en: 'This Week', vi: 'Tuần này' },
    'dashboard.later': { en: 'Later', vi: 'Sau đó' },
    'dashboard.ganttChart': { en: 'Project Timeline', vi: 'Tiến độ dự án' },

    // Kanban
    'kanban.title': { en: 'Kanban Board', vi: 'Bảng Kanban' },
    'kanban.newTask': { en: 'New Task', vi: 'Tạo công việc' },
    'kanban.backlog': { en: 'Backlog', vi: 'Tồn đọng' },
    'kanban.todo': { en: 'To Do', vi: 'Cần làm' },
    'kanban.inProgress': { en: 'In Progress', vi: 'Đang thực hiện' },
    'kanban.review': { en: 'Review', vi: 'Đang xem xét' },
    'kanban.done': { en: 'Done', vi: 'Hoàn thành' },
    'kanban.dropHere': { en: 'Drop tasks here', vi: 'Thả công việc vào đây' },

    // Tasks
    'task.title': { en: 'Title', vi: 'Tiêu đề' },
    'task.description': { en: 'Description', vi: 'Mô tả' },
    'task.priority': { en: 'Priority', vi: 'Độ ưu tiên' },
    'task.status': { en: 'Status', vi: 'Trạng thái' },
    'task.project': { en: 'Project', vi: 'Dự án' },
    'task.assignee': { en: 'Assignee', vi: 'Người thực hiện' },
    'task.deadline': { en: 'Deadline', vi: 'Hạn chót' },
    'task.startDate': { en: 'Start Date', vi: 'Ngày bắt đầu' },
    'task.dueDate': { en: 'Due', vi: 'Đến hạn' },
    'task.selectProject': { en: 'Select a project', vi: 'Chọn dự án' },
    'task.createTask': { en: 'Create Task', vi: 'Tạo công việc' },
    'task.noDeadline': { en: 'No deadline', vi: 'Chưa có hạn' },

    // Priority
    'priority.low': { en: 'Low', vi: 'Thấp' },
    'priority.medium': { en: 'Medium', vi: 'Trung bình' },
    'priority.high': { en: 'High', vi: 'Cao' },
    'priority.critical': { en: 'Critical', vi: 'Khẩn cấp' },

    // Projects
    'project.title': { en: 'Projects', vi: 'Dự án' },
    'project.newProject': { en: 'New Project', vi: 'Tạo dự án' },
    'project.editProject': { en: 'Edit Project', vi: 'Sửa dự án' },
    'project.name': { en: 'Project Name', vi: 'Tên dự án' },
    'project.description': { en: 'Description', vi: 'Mô tả' },
    'project.color': { en: 'Color', vi: 'Màu sắc' },
    'project.tasks': { en: 'tasks', vi: 'công việc' },
    'project.completed': { en: 'completed', vi: 'hoàn thành' },
    'project.showArchived': { en: 'Show archived', vi: 'Hiện lưu trữ' },
    'project.archived': { en: 'Archived', vi: 'Đã lưu trữ' },
    'project.unarchive': { en: 'Unarchive', vi: 'Bỏ lưu trữ' },
    'project.archive': { en: 'Archive', vi: 'Lưu trữ' },
    'project.manageMembers': { en: 'Manage Members', vi: 'Quản lý thành viên' },
    'project.noPermission': { en: 'No permission', vi: 'Không có quyền' },
    'project.options': { en: 'Project options', vi: 'Tùy chọn dự án' },

    // Calendar
    'calendar.title': { en: 'Calendar', vi: 'Lịch' },
    'calendar.today': { en: 'Today', vi: 'Hôm nay' },
    'calendar.selectedDate': { en: 'Selected Date', vi: 'Ngày đã chọn' },
    'calendar.tasksOnDate': { en: 'Tasks on this date', vi: 'Công việc trong ngày' },
    'calendar.noTasks': { en: 'No tasks on this date', vi: 'Không có công việc trong ngày này' },

    // Settings
    'settings.title': { en: 'Settings', vi: 'Cài đặt' },
    'settings.subtitle': { en: 'Manage your account and preferences', vi: 'Quản lý tài khoản và tùy chọn của bạn' },
    'settings.profile': { en: 'Profile', vi: 'Hồ sơ' },
    'settings.notifications': { en: 'Notifications', vi: 'Thông báo' },
    'settings.appearance': { en: 'Appearance', vi: 'Giao diện' },
    'settings.security': { en: 'Security', vi: 'Bảo mật' },
    'settings.language': { en: 'Language', vi: 'Ngôn ngữ' },
    'settings.theme': { en: 'Theme', vi: 'Chủ đề' },
    'settings.light': { en: 'Light', vi: 'Sáng' },
    'settings.dark': { en: 'Dark', vi: 'Tối' },
    'settings.profileSettings': { en: 'Profile Settings', vi: 'Cài đặt hồ sơ' },
    'settings.notificationPrefs': { en: 'Notification Preferences', vi: 'Tùy chọn thông báo' },
    'settings.appearanceSettings': { en: 'Appearance Settings', vi: 'Cài đặt giao diện' },
    'settings.securitySettings': { en: 'Security Settings', vi: 'Cài đặt bảo mật' },
    'settings.saveChanges': { en: 'Save Changes', vi: 'Lưu thay đổi' },
    'settings.changePassword': { en: 'Change Password', vi: 'Đổi mật khẩu' },
    'settings.currentPassword': { en: 'Current Password', vi: 'Mật khẩu hiện tại' },
    'settings.newPassword': { en: 'New Password', vi: 'Mật khẩu mới' },
    'settings.confirmNewPassword': { en: 'Confirm New Password', vi: 'Xác nhận mật khẩu mới' },
    'settings.updatePassword': { en: 'Update Password', vi: 'Cập nhật mật khẩu' },
    'settings.restartOnboarding': { en: 'Restart Onboarding Tour', vi: 'Xem lại hướng dẫn' },
    'settings.onboardingGuide': { en: 'Getting Started Guide', vi: 'Hướng dẫn bắt đầu' },
    'settings.onboardingDesc': { en: 'Show the onboarding tutorial again to learn about features.', vi: 'Xem lại hướng dẫn để tìm hiểu các tính năng.' },
    'settings.changeAvatar': { en: 'Change Avatar', vi: 'Đổi ảnh đại diện' },
    'settings.uploadAvatar': { en: 'Upload Avatar', vi: 'Tải ảnh lên' },

    // Notifications
    'notification.title': { en: 'Notifications', vi: 'Thông báo' },
    'notification.markAllRead': { en: 'Mark all read', vi: 'Đánh dấu đã đọc' },
    'notification.noNotifications': { en: 'No notifications yet', vi: 'Chưa có thông báo' },
    'notification.viewAll': { en: 'View all notifications', vi: 'Xem tất cả thông báo' },
    'notification.emailNotifications': { en: 'Email Notifications', vi: 'Thông báo qua Email' },
    'notification.taskReminders': { en: 'Task Reminders', vi: 'Nhắc nhở công việc' },
    'notification.deadlineAlerts': { en: 'Deadline Alerts', vi: 'Cảnh báo hạn chót' },
    'notification.projectUpdates': { en: 'Project Updates', vi: 'Cập nhật dự án' },

    // Onboarding
    'onboarding.welcome': { en: 'Welcome to DBI.Hive! 🐝', vi: 'Chào mừng đến DBI.Hive! 🐝' },
    'onboarding.welcomeDesc': { en: "Let's take a quick tour of the main features. Click Next to continue.", vi: 'Hãy cùng khám phá các tính năng chính. Nhấn Tiếp theo để tiếp tục.' },
    'onboarding.dashboardTitle': { en: 'Dashboard', vi: 'Tổng quan' },
    'onboarding.dashboardDesc': { en: 'This is your Dashboard - get an overview of tasks, projects, and activity at a glance.', vi: 'Đây là Tổng quan - xem tóm tắt công việc, dự án và hoạt động.' },
    'onboarding.kanbanTitle': { en: 'Kanban Board', vi: 'Bảng Kanban' },
    'onboarding.kanbanDesc': { en: 'Drag and drop tasks between columns to update their status. Perfect for visual workflow management.', vi: 'Kéo thả công việc giữa các cột để cập nhật trạng thái. Hoàn hảo để quản lý công việc trực quan.' },
    'onboarding.projectsTitle': { en: 'Project Management', vi: 'Quản lý dự án' },
    'onboarding.projectsDesc': { en: 'Create and manage multiple projects. Assign team members, set deadlines, and track progress.', vi: 'Tạo và quản lý nhiều dự án. Phân công thành viên, đặt hạn chót và theo dõi tiến độ.' },
    'onboarding.calendarTitle': { en: 'Calendar View', vi: 'Xem lịch' },
    'onboarding.calendarDesc': { en: 'View all your tasks and deadlines in a calendar format. Never miss an important date!', vi: 'Xem tất cả công việc và hạn chót theo lịch. Không bỏ lỡ ngày quan trọng!' },
    'onboarding.backlogTitle': { en: 'Backlog', vi: 'Danh sách tồn đọng' },
    'onboarding.backlogDesc': { en: 'View and manage all pending tasks in the backlog. Prioritize and organize work before moving to active sprints.', vi: 'Xem và quản lý tất cả công việc chờ xử lý. Sắp xếp ưu tiên và tổ chức công việc trước khi chuyển vào sprint.' },
    'onboarding.notificationsTitle': { en: 'Notifications', vi: 'Thông báo' },
    'onboarding.notificationsDesc': { en: "Click here to view your notifications. You'll be alerted when tasks are assigned or updated.", vi: 'Nhấn vào đây để xem thông báo. Bạn sẽ được thông báo khi có công việc được giao hoặc cập nhật.' },
    'onboarding.projectSelectorTitle': { en: 'Project Selector', vi: 'Chọn dự án' },
    'onboarding.projectSelectorDesc': { en: 'Switch between projects using this dropdown. Select "All Projects" to see everything.', vi: 'Chuyển đổi giữa các dự án bằng menu này. Chọn "Tất cả dự án" để xem toàn bộ.' },
    'onboarding.settingsTitle': { en: 'Settings', vi: 'Cài đặt' },
    'onboarding.settingsDesc': { en: 'Customize your profile, notifications, and theme in Settings. You can also restart this tour from there!', vi: 'Tùy chỉnh hồ sơ, thông báo và giao diện trong Cài đặt. Bạn cũng có thể xem lại hướng dẫn này từ đó!' },
    'onboarding.finishTitle': { en: "You're All Set! 🎉", vi: 'Hoàn tất! 🎉' },
    'onboarding.finishDesc': { en: "You're ready to start using DBI.Hive. Create your first project or explore the dashboard!", vi: 'Bạn đã sẵn sàng sử dụng DBI.Hive. Tạo dự án đầu tiên hoặc khám phá tổng quan!' },
    'onboarding.step': { en: 'Step', vi: 'Bước' },
    'onboarding.of': { en: 'of', vi: 'trên' },
};

interface I18nState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

export const useI18nStore = create<I18nState>()(
    persist(
        (set, get) => ({
            language: 'vi',

            setLanguage: (lang: Language) => {
                set({ language: lang });
            },

            t: (key: string) => {
                const lang = get().language;
                const translation = translations[key];
                if (!translation) return key;
                return translation[lang] || translation['en'] || key;
            },
        }),
        {
            name: 'dbi-hive-i18n',
        }
    )
);

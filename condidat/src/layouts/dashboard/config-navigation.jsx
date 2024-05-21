import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Offers',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: icon('ic_setting'),
  },
];

export default navConfig;

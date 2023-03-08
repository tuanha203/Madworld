import { FC } from 'react';
import { Tooltip } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import _ from 'lodash'
import { COMING_SOON } from 'constants/text';
import SearchBarHeader from 'components/modules/search-bar-header';
import { useSelector } from 'react-redux';

interface INavBarProps {
  isDrawer?: boolean;
  handleCloseSearchResult?: () => void;
}
interface IRoute {
  path: string; // This must be a unique key
  label: string;
  className?: string;
  comingSoon?: boolean;
}

const routes: IRoute[] = [
  { path: '/', label: 'Home', className: 'lg:hidden' },
  { path: '/dao', label: 'DAO', comingSoon: true },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/branded-projects', label: 'Branded Projects' },
  { path: '/new-events', label: 'News & Events', comingSoon: true },
];
const NavBar: FC<INavBarProps> = (props) => {
  const { isDrawer, handleCloseSearchResult } = props;
  const router = useRouter();
  const { text } = useSelector((state:any) => state.theme);
  const renderRoutes = () => {
    return routes.filter(item => _.isEmpty(text) || item.label === "Marketplace").map((r) => (
      <li className={`${r.className || ''}`} key={r.path}>
        <span style={text} className={router.pathname === r.path ? `md:text-primary-60 md:border-b-2 border-primary-60 md:pb-1 ` : `` }>
          {r.comingSoon ? (
            <Tooltip title={COMING_SOON} arrow placement="top">
              <span>{r.label}</span>
            </Tooltip>
          ) : (
            <Link href={r.path}>{r.label}</Link>
          )}
        </span>
      </li>
    ));
  };

  return (
    <div
      className={`lg:flex md:flex-row sm:flex-col items-center justify-between w-full mt-0 md:pb-0 pb-[50px] ${
        isDrawer ? '' : 'hidden'
      }`}
    >
      <SearchBarHeader handleCloseSearchResult={handleCloseSearchResult}/>
      <div className="flex sm:flex-col md:flex-row items-center w-full justify-center">
        <ul className="links flex sm:flex-col md:flex-row sm:items-start sm:w-full md:w-auto md:items-center md:gap-6 2xl:gap-12">
          {renderRoutes()}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;

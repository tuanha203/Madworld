export { default as LeaderBoardList } from './List';
export { default as LeaderBoardItem } from './Item';

/**
 * * Example **
 <LeaderBoardList
  data={[{ collection: 'Hello', asset: 'helo', volume: 'hello', time: '24%' }]}
  columns={[
    {
      name: 'collection',
      label: 'Hot Collections',
      className: 'max-w-[332px]',
      type: 'avatar',
    },
    {
      name: 'asset',
      label: 'Assets',
      options: {
        maxWidth: 'none',
      },
    },
    {
      name: 'volume',
      label: 'Volume',
      options: {
        maxWidth: 'none',
      },
    },
    {
      name: 'time',
      label: '24h %',
      options: {
        maxWidth: 'none',
      },
    },
  ]}
  keyProperty="id"
/>; 
*/

'use babel';

export default function (cb) {
  return [
    // Row 1
    [
      {
        icon: 'play',
        title: 'Start',
        action: 'start',
        onClick: cb
      },
      {
        icon: 'stop',
        title: 'Stop',
        action: 'stop',
        onClick: cb
      },
      {
        icon: 'repeat',
        title: 'Restart',
        action: 'restart',
        onClick: cb
      }
    ],
    // Row 2
    [
      {
        icon: 'align-left',
        title: 'Logs',
        action: 'logs',
        onClick: cb
      },
      {
        icon: 'trash',
        title: 'Remove',
        action: 'remove',
        onClick: cb
      },
      {
        icon: 'console',
        title: 'Open console',
        action: 'console',
        onClick: cb
      }
    ]
  ];
}

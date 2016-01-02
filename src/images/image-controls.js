'use babel';

export default function (cb) {
  return [
    // Row 1
    [
      {
        icon: 'trash',
        title: 'Remove',
        action: 'remove',
        onClick: cb
      },
      {
        icon: 'hdd',
        title: 'Create',
        action: 'create',
        onClick: cb
      }
    ]
  ];
}

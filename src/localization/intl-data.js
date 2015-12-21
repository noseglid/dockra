import { readFileSync } from 'fs';

export default {
  locales: 'en-US',
  messages: {
    containers: {
      filtered: readFileSync(`${__dirname}/strings/containers.filtered.icu`).toString('utf8')
    },
    images: {
      filtered: readFileSync(`${__dirname}/strings/images.filtered.icu`).toString('utf8')
    }
  }
};

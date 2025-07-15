import { clearTitles } from '../consts/titleRequirements';

const order = clearTitles.map(t => t.title);

const getBestTitle = (titles = []) => {
  let best = null;
  titles.forEach(t => {
    const idx = order.indexOf(t);
    if (idx !== -1 && (best === null || idx > order.indexOf(best))) {
      best = t;
    }
  });
  return best;
};

export default getBestTitle;

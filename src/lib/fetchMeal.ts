export interface MealInfo {
  date: string;
  morning: string[];
  lunch: string[];
  dinner: string[];
}

export async function fetchMealData(): Promise<MealInfo[]> {
  try {
    const res = await fetch('http://kagdakj.us.to/timetable/meal', {
      next: { revalidate: 3600 } // 1시간 캐싱
    });

    if (!res.ok) {
      console.error('Failed to fetch meal data:', res.statusText);
      return [];
    }

    const html = await res.text();
    return parseMealText(html);
  } catch (e) {
    console.error('Meal fetch error:', e);
    return [];
  }
}

function parseMealText(html: string): MealInfo[] {
  const meals: MealInfo[] = [];
  const sections = html.split(/class="section"/);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];

    const dateMatch = section.match(/<h1>(.*?)<\/h1>/);
    if (!dateMatch) continue;
    const date = dateMatch[1].trim();

    const mealInfo: MealInfo = {
      date,
      morning: [],
      lunch: [],
      dinner: []
    };

    const mealDivs = section.split(/class="meal"/);
    for (let j = 1; j < mealDivs.length; j++) {
      const mealDiv = mealDivs[j];
      const typeMatch = mealDiv.match(/<h2>(.*?)<\/h2>/);
      if (!typeMatch) continue;

      const type = typeMatch[1].trim().toLowerCase();
      if (type !== 'morning' && type !== 'lunch' && type !== 'dinner') continue;

      const pRegex = /<p>(.*?)<\/p>/g;
      let pMatch;
      while ((pMatch = pRegex.exec(mealDiv)) !== null) {
        const item = pMatch[1].trim();
        if (item) {
          mealInfo[type].push(item);
        }
      }
    }

    meals.push(mealInfo);
  }

  return meals;
}

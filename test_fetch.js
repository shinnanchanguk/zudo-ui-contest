const { readFileSync } = require('fs');

const html = readFileSync('./meal.html', 'utf8');

function parseMealText(html) {
  const meals = [];
  const sections = html.split(/class="section"/);
  
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    
    const dateMatch = section.match(/<h1>(.*?)<\/h1>/);
    if (!dateMatch) continue;
    const date = dateMatch[1].trim();
    
    const mealInfo = {
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

console.log(JSON.stringify(parseMealText(html), null, 2));

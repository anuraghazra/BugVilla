import useFetch from "hooks/useFetch";
import { useState, useEffect } from "react";

const useSuggestion = (url: string, prop: string[]) => {
  const [suggestions] = useFetch(url, { cache: true });
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!suggestions) return;
    const isBug = prop[1] === 'bugId';
    const suggestionsArray = suggestions.data.map((suggestions: any) => {
      let display = suggestions[prop[0]];
      if (isBug) {
        // if it's a bug then append the #1 (bugId) to the display
        display = suggestions[prop[0]] + ' #' + suggestions[prop[1]];
      }
      return { display, id: suggestions[prop[1]] };
    });
    setData(suggestionsArray);
  }, [suggestions]);

  return data;
};


export default useSuggestion;
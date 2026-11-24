import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description?: string;
  noIndex?: boolean;
}

export const SeoHead = ({ title, description, noIndex = false }: SeoHeadProps) => {
  useEffect(() => {
    document.title = title;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.remove();
    }
  }, [title, description, noIndex]);

  return null;
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BMWModel } from '../data/models';

/**
 * Meaningful alt text per photo (the files themselves are untouched).
 * Descriptions follow public/images/models/ASSETS.md.
 */
const CARD_ALT: Record<string, string> = {
  m2: 'Red BMW M2 on a forest road, front three-quarter view',
  m3: 'Blue BMW M3 front three-quarter view in a parking garage',
  m4: 'Matte black BMW M4 on a cobblestone driveway, front view',
  m5: 'White BMW M5 front three-quarter view',
  m8: 'Matte blue BMW M8 Gran Coupe parked in an urban garage',
};

/** Per-photo crop so the car (not the asphalt) stays in a wide frame. */
const CARD_POS: Record<string, string> = {
  m2: '50% 62%',
  m3: '50% 58%',
  m4: '50% 60%',
  m5: '50% 58%',
  m8: '50% 58%',
};

interface ModelCardProps {
  model: BMWModel;
  index: number;
  total: number;
  /** Fired when the card link receives keyboard focus (gallery syncs the pin). */
  onFocusCard?: (index: number, e: React.FocusEvent<HTMLAnchorElement>) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, index, total, onFocusCard }) => {
  const stats: Array<[string, string]> = [
    ['Power', model.specs.power],
    ['0–60 mph', model.specs.acceleration],
    ['Top speed', model.specs.topSpeed],
    ['Chassis', model.chassisCode],
  ];

  return (
    <li
      className="lineup-card"
      id={`model-card-${model.id}`}
      data-index={index}
      style={{ ['--pos' as string]: CARD_POS[model.id] ?? '50% 60%' }}
    >
      {/* registration ticks around the frame */}
      <span className="lineup-card__ticks" aria-hidden="true" />

      <div className="lineup-card__frame">
        <div className="lineup-card__media">
          <img
            className="lineup-card__img"
            src={model.heroImage}
            alt={CARD_ALT[model.id] ?? `${model.name} front view`}
            width={1920}
            height={1200}
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="lineup-card__dim" aria-hidden="true" />
        <div className="lineup-card__scrim" aria-hidden="true" />

        <span className="lineup-card__ghost" aria-hidden="true">
          {model.index}
        </span>

        <div className="lineup-card__top" aria-hidden="true">
          <span>
            {model.index} / {String(total).padStart(2, '0')}
          </span>
          <span className="m-badge-stripes">
            <span className="m-stripe-1" />
            <span className="m-stripe-2" />
            <span className="m-stripe-3" />
          </span>
        </div>

        <div className="lineup-card__body">
          <div className="lineup-card__main">
            <p className="lineup-card__desc">{model.descriptor}</p>
            <h3 className="lineup-card__title" aria-label={model.name}>
              <span className="lineup-card__brand">BMW</span>
              <span className="lineup-card__code">{model.shortName}</span>
            </h3>
            {/* visual CTA only; the stretched link below is the control */}
            <span className="lineup-card__cta" aria-hidden="true">
              <span className="lineup-card__cta-label">Explore model</span>
              <span className="lineup-card__cta-arrow">
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </span>
          </div>

          <dl className="lineup-card__stats">
            {stats.map(([label, value]) => (
              <div className="lineup-card__stat" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Real anchor: Cmd/Ctrl/middle-click open a new tab, plain click is a router navigation. */}
      <Link
        className="lineup-card__link"
        to={`/models/${model.id}`}
        onFocus={(e) => onFocusCard?.(index, e)}
      >
        <span className="sr-only">Explore model: {model.name}</span>
      </Link>
    </li>
  );
};

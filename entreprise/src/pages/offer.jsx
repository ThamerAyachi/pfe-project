import { Helmet } from 'react-helmet-async';

import { OfferView } from 'src/sections/offers/views';

export default function OfferPage() {
  return (
    <>
      <Helmet>
        <title>New Offer | Profi Link</title>
      </Helmet>

      <OfferView />
    </>
  );
}

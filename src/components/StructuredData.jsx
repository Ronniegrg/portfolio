import { Helmet } from "react-helmet-async";

/**
 * Component for adding structured JSON-LD data to the page
 */
const StructuredData = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default StructuredData;

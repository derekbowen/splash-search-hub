import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center max-w-xl px-4">
          <h1 className="text-4xl font-extrabold mb-4">PoolRentalNearMe.com</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Find public pools near you or rent a private backyard pool.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/public-pools">Browse Public Pools</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://www.poolrentalnearme.com" target="_blank" rel="noopener noreferrer">Rent a Private Pool</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;

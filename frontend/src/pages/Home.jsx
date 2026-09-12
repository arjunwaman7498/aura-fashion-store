import { Link } from "react-router-dom";

const categories = [
  {
    name: "Sarees",
    description: "Timeless elegance",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kurtis",
    description: "Effortless everyday style",
    image:
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dresses",
    description: "Modern feminine silhouettes",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Lehengas",
    description: "Made for celebrations",
    image:
     "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80",
  }
];

function Home() {
  return (
    <main className="bg-[#faf9f7] text-gray-900">

      {/* Hero Section */}
      <section className="relative min-h-[650px] overflow-hidden bg-[#eee9e2]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-10 lg:px-16">

          {/* Hero Content */}
          <div className="max-w-xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
              New Collection · 2026
            </p>

            <h1 className="text-5xl font-light leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Elegance,
              <br />
              <span className="font-medium">redefined.</span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-7 text-gray-600">
              Discover thoughtfully designed fashion for every moment.
              Contemporary silhouettes, timeless details and effortless style.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center bg-gray-900 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Shop Collection
              </Link>

              <Link
                to="/products?category=Sarees"
                className="inline-flex items-center border border-gray-900 px-7 py-3.5 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
              >
                Explore Sarees
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative h-[520px] overflow-hidden md:h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=85"
              alt="Women's fashion collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
              Shop by category
            </p>

            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Find your style
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden text-sm font-medium underline underline-offset-4 sm:block"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name}`}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-20 text-white">
                  <h3 className="text-lg font-medium">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs text-white/80">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
                The AURA edit
              </p>

              <h2 className="max-w-lg text-4xl font-light leading-tight sm:text-5xl">
                Pieces designed to become part of your story.
              </h2>

              <p className="mt-6 max-w-lg leading-7 text-gray-600">
                From everyday essentials to occasion-ready silhouettes,
                discover pieces that bring modern style to your wardrobe.
              </p>

              <Link
                to="/products"
                className="mt-8 inline-block border-b border-gray-900 pb-1 text-sm font-medium"
              >
                Discover the collection →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80"
                alt="Women's fashion"
                className="aspect-[3/4] w-full object-cover"
              />

              <img
                src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=700&q=80"
                alt="Women's clothing"
                className="mt-10 aspect-[3/4] w-full object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-[#eee9e2] px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
          Stay in the know
        </p>

        <h2 className="mt-3 text-3xl font-medium">
          Your wardrobe, thoughtfully curated.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600">
          Explore our latest arrivals and timeless collections.
        </p>

        <Link
          to="/products"
          className="mt-7 inline-block bg-gray-900 px-8 py-3.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Shop Now
        </Link>
      </section>

    </main>
  );
}

export default Home;
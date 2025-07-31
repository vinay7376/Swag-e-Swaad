import React from "react";
import { Heart, Trash2 } from "lucide-react";

const Favorites = ({ favorites = [], onRemove }) => {
  return (
    <div className="min-h-[70vh] bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2">
          <Heart className="text-red-500" size={20} />
          Your Favorites
        </h1>

        {favorites.length === 0 ? (
          <p className="text-zinc-500 text-base">No favorites yet. Start adding some! ❤️</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-36 w-full object-cover"
                />
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-sm sm:text-base font-medium text-zinc-800 dark:text-white truncate">
                      {item.name}
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {item.description || "No description available."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-semibold text-blue-600">₹{item.price.toFixed(2)}</span>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-500 hover:text-red-600 transition"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

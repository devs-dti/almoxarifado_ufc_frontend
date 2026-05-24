"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { X as XIcon } from "lucide-react";
import { MaterialItem, Material } from "./materialitem";
import { RegisterBotton } from "./registerbutton";

type ModalListagemProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "entrada" | "saida" | null;
  onCadastrarClick: () => void;
  onEditarClick: (material: Material) => void;
};

export default function ModalListagem({
  isOpen,
  onClose,
  type,
  onCadastrarClick,
  onEditarClick,
}: ModalListagemProps) {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PAGINATION STATE: Manages progressive database paging via dynamic scroll interactions
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // SANITIZATION EFFECT: Resets state completely when the modal toggles or transitions types to prevent data bleeding
  useEffect(() => {
    setMateriais([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, [isOpen, type]);

  // DATA FETCHING LAYER: Orchestrates multi-endpoint synchronization and paginated data accumulation
  useEffect(() => {
    if (!isOpen || !type || (!hasMore && page > 0)) return;

    const fetchMateriais = async () => {
      if (page === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        // POLYMORPHIC ROUTING: Targets unique Swagger contracts dynamically based on user context selection
        const endpoint =
          type === "entrada"
            ? `/entries?page=${page}&size=10`
            : `/transfers?page=${page}&size=10`;

        const response = await api.get(endpoint);

        // DATA EXTRACTION GUARD: Normalizes variations between different server response paginated data wrappers
        const novosMateriais =
          response.data.data || response.data.content || response.data || [];

        // PAGINATION CEILING: Flags the end of dataset tracking if the chunk returned is smaller than requested size
        if (novosMateriais.length < 10) {
          setHasMore(false);
        }

        // STATE ACCUMULATION: Spreads incoming chunks onto existing state if performing a trailing append
        setMateriais((prev) =>
          page === 0 ? novosMateriais : [...prev, ...novosMateriais],
        );
      } catch (err) {
        console.error("Erro ao buscar dados do servidor:", err);
        setError("Não foi possível carregar as informações. Tente novamente.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchMateriais();
  }, [isOpen, type, page]);

  // UX MECHANICS: Monitors viewport coordinates to trigger incremental fetching before reaching viewport boundaries
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isLoading || isLoadingMore || !hasMore) return;

    // SCROLL BOUNDARY CHECK: Advances the page counter once user is within 20px threshold of the viewport bottom
    const isNearBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 20;

    if (isNearBottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (!isOpen || !type) return null;

  const isEntrada = type === "entrada";
  const title = isEntrada ? "Entrada de Materiais" : "Saída de Materiais";
  const HeaderIcon = isEntrada
    ? FaRegArrowAltCircleDown
    : FaRegArrowAltCircleUp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity duration-300">
      <div
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl flex flex-col justify-between transform transition-all duration-300 ease-out animate-slide-down"
        style={{ minHeight: "450px" }}
      >
        <div>
          {/* Header Layout Component */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
              <HeaderIcon className="text-xl" />
              <h2>{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XIcon className="text-xl text-gray-500" />
            </button>
          </div>

          {/* Dynamic Scrollable Track Context */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="max-h-[300px] overflow-y-auto pr-1"
          >
            {isLoading && page === 0 ? (
              <div className="flex flex-col items-center justify-center pt-10 gap-2">
                <div className="w-6 h-6 border-2 border-[#8A38F5] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400">
                  Buscando informações reais...
                </p>
              </div>
            ) : error ? (
              <p className="text-center text-sm text-red-500 pt-14 px-4">
                {error}
              </p>
            ) : materiais.length > 0 ? (
              <>
                {materiais.map((item) => (
                  <MaterialItem
                    key={item.id}
                    material={item}
                    onEditarClick={onEditarClick}
                  />
                ))}

                {/* Trailing Loader Component indicating secondary requests are currently executing */}
                {isLoadingMore && (
                  <div className="flex justify-center py-4">
                    <div className="w-5 h-5 border-2 border-[#8A38F5] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-sm text-gray-400 pt-14">
                Nenhum registro de {type} encontrado no banco.
              </p>
            )}
          </div>
        </div>

        {/* Action Layer Context */}
        <div className="mt-6">
          <RegisterBotton transactionType={type} onSuccess={onCadastrarClick} />
        </div>
      </div>
    </div>
  );
}

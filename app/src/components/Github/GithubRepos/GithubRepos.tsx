"use client";

import React, { useEffect, useState, useMemo } from "react";
import { FaGithub } from "react-icons/fa";
import api from "../../../utils/api";
import axios from "axios";
import useNotification from "../../ui/Notification/Notification";
import Loader from "../../ui/Loader/Loader";
import { motion } from "framer-motion";
import RepoPagination from "./RepoPagination/RepoPagination";
import Input from "../../ui/Input/Input";
import Select from "../../ui/Select/Select";
import RepoList from "./RepoList/RepoList";
import Repo from "../../../types/Repo/Repo";

const GithubRepos: React.FC = () => {
  const { notify } = useNotification();

  const [installationIds, setInstallationIds] = useState<string[]>([]);
  const [installationIdsLoaded, setInstallationIdsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<string>("All");

  const [allRepos, setAllRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const fetchInstallationIds = async () => {
      try {
        const res = await api.get("/api/github/installation-id", {
          withCredentials: true,
        });
        const ids: string[] = res.data.installation_ids || [];
        setInstallationIds(ids);
      } catch (err) {
        console.error("Failed to fetch installation IDs:", err);
        setError("Failed to fetch GitHub installation IDs.");
        setInstallationIds([]);
      } finally {
        setInstallationIdsLoaded(true);
      }
    };
    fetchInstallationIds();
  }, []);

  useEffect(() => {
    if (!installationIdsLoaded) return;
    if (installationIds.length === 0) {
      setAllRepos([]);
      setLoading(false);
      return;
    }
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all repos in a single call using installation_ids param
        const res = await api.get("/api/github/repos", {
          params: { installation_ids: installationIds.join(",") },
          withCredentials: true,
        });
        const repos: Repo[] = res.data.repositories || [];
        setAllRepos(repos);
        setPage(1);
      } catch (err: unknown) {
        let message = "Failed to fetch GitHub repositories.";
        let removedInstallationsError = false;
        let isFatal = false;
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.error || message;
          if (
            err.response?.data?.removedInstallationIds &&
            Array.isArray(err.response.data.removedInstallationIds)
          ) {
            removedInstallationsError = true;
          }
          // If backend returns 500 or JWT error, treat as fatal
          if (
            err.response?.status === 500 ||
            (typeof message === "string" &&
              message.includes("secretOrPrivateKey must be an asymmetric key"))
          ) {
            isFatal = true;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
        setAllRepos([]);
        notify(message, "error");
        if (removedInstallationsError) {
          // Refresh installation IDs to update UI and prevent infinite retry
          try {
            const res = await api.get("/api/github/installation-id", {
              withCredentials: true,
            });
            setInstallationIds(res.data.installation_ids || []);
            notify(
              "Some GitHub installations were invalid or expired and have been removed. Please reconnect GitHub if needed.",
              "warning"
            );
          } catch {
            setInstallationIds([]);
          }
        } else if (isFatal) {
          // On fatal error, clear installation IDs to stop retrying
          setInstallationIds([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [installationIds, installationIdsLoaded, notify]);

  const filteredRepos = useMemo(() => {
    let filtered = allRepos;

    if (selectedOwner !== "All") {
      filtered = filtered.filter((r) => r.owner_login === selectedOwner);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allRepos, searchTerm, selectedOwner]);

  const totalPages = Math.ceil(filteredRepos.length / perPage);
  const paginatedRepos = filteredRepos.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const owners = useMemo(() => {
    const ownerSet = new Set(allRepos.map((r) => r.owner_login));
    return ["All", ...Array.from(ownerSet).sort()];
  }, [allRepos]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleOwnerChange = (value: string) => {
    setSelectedOwner(value);
    setPage(1);
  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section>
        <FaGithub className="mx-auto mb-2 text-3xl" />
        <div className="text-lg font-semibold mb-1">{error}</div>
      </section>
    );
  }

  if (installationIdsLoaded && installationIds.length === 0) {
    return (
      <section>
        <FaGithub className="mx-auto mb-2 text-3xl text-zinc-500" />
        <div className="text-lg font-semibold mb-1">GitHub not connected</div>
        <div className="text-sm">
          Please connect your GitHub on your profile page first.
        </div>
        <div className="text-xs text-orange-400 mt-4">
          If your repositories are not showing up but your account is connected,
          try uninstalling the GitHub app from your account first, then sign in
          again through the profile page.
        </div>
      </section>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 px-2 sm:px-0">
        <div className="flex-1">
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search repositories..."
            icon={<FaGithub className="text-zinc-400" />}
            className="w-full min-w-0"
          />
        </div>
        <div className="flex-1 sm:max-w-xs">
          <Select
            value={selectedOwner}
            onChange={handleOwnerChange}
            options={owners.map((owner) => ({ value: owner, label: owner }))}
            className="w-full min-w-0"
          />
        </div>
      </div>

      <p className="text-xs text-orange-400 mb-4 px-2 sm:px-6 text-center">
        If your repositories are not showing up but your account is connected,
        try uninstalling the GitHub app from your account first, then sign in
        again through the profile page.
      </p>

      <section className="px-1 sm:px-0">
        <RepoList repos={paginatedRepos} />

        <div className="w-full flex justify-center">
          <RepoPagination
            page={page}
            totalPages={totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
        </div>
      </section>
    </motion.div>
  );
};

export default GithubRepos;

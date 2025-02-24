import React from "react";
import { Star } from "lucide-react";

interface PostData {
  title: string;
  engagementScore: number; // Rating out of 5
  datePosted: string
}

interface TableProps {
  data: PostData[];
}

export const PostTable: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
              Post Title
            </th>
            <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
              Engagement Score
            </th>
            <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
              Date Posted
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((post, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b text-gray-800">{post.title}</td>
              <td className="px-4 py-2 border-b">
                {/* <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(post.engagementScore) ? "gold" : "none"}
                      stroke={i < Math.ceil(post.engagementScore) ? "gold" : "gray"}
                    />
                  ))}
                </div> */}
                {post.engagementScore}
              </td>
              <td className="px-4 py-2 border-b text-gray-800">
                <p>{post.datePosted}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

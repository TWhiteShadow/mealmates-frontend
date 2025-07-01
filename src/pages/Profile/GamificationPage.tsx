import { useState, useEffect } from 'react';
import { useUserData } from '@/api/User';
import { 
  useUserBadges, 
  useUserProgress, 
  useUserCredits, 
  useGamificationHistory,
  Badge as BadgeType
} from '@/api/Gamification';
import BadgeGallery from '@/components/Gamification/BadgeGallery';
import ProgressTracker from '@/components/Gamification/ProgressTracker';
import CreditCounter from '@/components/Gamification/CreditCounter';
import GamificationHistory from '@/components/Gamification/GamificationHistory';
import BadgeNotification from '@/components/Gamification/BadgeNotification';
import ProfileAppBar from '@/components/ProfileAppBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

const GamificationPage = () => {
  const navigate = useNavigate();
  const { data: userData } = useUserData();
  const userId = userData?.id ?? 0;
  const [newBadge, setNewBadge] = useState<BadgeType | null>(null);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);

  const { 
    data: badges, 
    isLoading: isLoadingBadges 
  } = useUserBadges(userId);
  
  const { 
    data: progressData, 
    isLoading: isLoadingProgress 
  } = useUserProgress(userId);
  
  const { 
    data: credits, 
    isLoading: isLoadingCredits 
  } = useUserCredits(userId);
  
  const { 
    data: gamificationHistory, 
    isLoading: isLoadingHistory 
  } = useGamificationHistory(userId, 20, 0);

  // Simulate badge notification on first load
  useEffect(() => {
    // This is just an example - in a real app, you would need to determine
    // when a new badge is earned through a websocket or notification system
    const storedBadgeIds = localStorage.getItem('viewedBadges');
    const viewedBadgeIds = storedBadgeIds ? JSON.parse(storedBadgeIds) : [];
    
    if (badges && badges.length > 0) {
      const unlockedBadges = badges.filter(b => b.isUnlocked);
      
      if (unlockedBadges.length > 0) {
        const unviewedBadges = unlockedBadges.filter(
          badge => !viewedBadgeIds.includes(badge.id)
        );
        
        if (unviewedBadges.length > 0) {
          setNewBadge(unviewedBadges[0]);
          setShowBadgeNotification(true);
          
          // Store viewed badges in localStorage
          const updatedViewedBadges = [
            ...viewedBadgeIds,
            unviewedBadges[0].id
          ];
          localStorage.setItem('viewedBadges', JSON.stringify(updatedViewedBadges));
        }
      }
    }
  }, [badges]);

  return (
    <div className="min-h-screen pb-20 bg-gray-100">
      <ProfileAppBar>
        <div className="relative flex items-center size-full justify-center">
          <Button
            type="button"
            variant="ghost"
            className="absolute left-3 p-1"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="size-8 text-purple-dark" />
          </Button>
          <span className="text-lg font-Lilita font-bold text-purple-dark">
            Gamification
          </span>
        </div>
      </ProfileAppBar>
      
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Mes crédits</CardTitle>
              <CreditCounter 
                credits={credits} 
                isLoading={isLoadingCredits} 
                showLifetime={true}
              />
            </div>
            <CardDescription>
              Gagnez des crédits en utilisant la plateforme
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="badges">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="badges" className="flex-1">Badges</TabsTrigger>
            <TabsTrigger value="progress" className="flex-1">Progression</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mes badges</CardTitle>
                <CardDescription>
                  Complétez des activités pour débloquer des badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BadgeGallery 
                  badges={badges || []} 
                  isLoading={isLoadingBadges} 
                  showLocked={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ma progression</CardTitle>
                <CardDescription>
                  Votre progression vers les prochains badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressTracker 
                  progressData={progressData || []} 
                  isLoading={isLoadingProgress} 
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historique</CardTitle>
                <CardDescription>
                  Historique des badges et crédits obtenus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GamificationHistory 
                  notifications={gamificationHistory} 
                  isLoading={isLoadingHistory}
                  emptyMessage="Vous n'avez pas encore d'historique de gamification."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {newBadge && (
        <BadgeNotification 
          badge={newBadge} 
          open={showBadgeNotification} 
          onClose={() => setShowBadgeNotification(false)} 
        />
      )}
    </div>
  );
};

export default GamificationPage;

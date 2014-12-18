<?php
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class Confide extends Eloquent {
    
    use SoftDeletingTrait;

    public function pull() {
        return $this->belongsTo('Pull');
    }
}